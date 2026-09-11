import test from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  checkReady,
  recommendations,
  planReady,
  maxStep,
  restore,
  referral,
  selectAction,
  resetPlan,
  planText,
  careMessages,
  followup,
  GOALS,
  DURATIONS,
  IMPACTS,
  QUESTIONS,
  SAFETY,
  MOMENTS,
  BACKUPS,
  FEASIBILITY,
} from "../prototype/v2/core.js";
function complete() {
  const s = initialState();
  s.wish = "ritme";
  s.goal = GOALS[0];
  s.answers = Object.fromEntries(Object.keys(QUESTIONS).map((k) => [k, 0]));
  s.safety = Object.fromEntries(Object.keys(SAFETY).map((k) => [k, "nee"]));
  s.duration = DURATIONS[0];
  s.impact = IMPACTS[0];
  return s;
}
function plan() {
  const s = complete();
  s.topic = "ritme";
  s.understood = true;
  selectAction(s, "rise");
  s.details.rise = {
    moment: MOMENTS[0],
    backup: BACKUPS[0],
    feasible: FEASIBILITY[0],
    time: "07:30",
  };
  return s;
}
test("every missing core or safety answer blocks a personal conclusion, also with a referral", () => {
  for (const group of ["answers", "safety"])
    for (const k of Object.keys(complete()[group])) {
      const s = complete();
      delete s[group][k];
      assert.equal(checkReady(s), false);
      assert.deepEqual(recommendations(s), []);
      assert.equal(maxStep(s), 2);
    }
  assert.equal(referral("?source=fysionair&sleep=high&focus=ritme"), "ritme");
  assert.equal(checkReady(initialState()), false);
});
test("no symptoms, single concern and equal concerns keep choice transparent", () => {
  const s = complete();
  assert.deepEqual(recommendations(s), []);
  s.answers.ritme = 3;
  assert.deepEqual(recommendations(s), ["ritme"]);
  s.answers.piekeren = 3;
  s.answers.inslapen = 3;
  assert.deepEqual(
    new Set(recommendations(s)),
    new Set(["ritme", "piekeren", "inslapen"]),
  );
  assert.equal(s.topic, "");
});
test("regularity never creates a restriction schedule", () => {
  const s = plan();
  s.answers.ritme = 3;
  assert.equal(planReady(s), true);
  assert.doesNotMatch(planText(s), /naar bed om|uren in bed|slaapvenster/i);
  assert.equal(selectAction(s, "restrict"), false);
});
test("safety advice is visible before the check is complete", () => {
  const s = initialState();
  s.safety.sleepy = "ja";
  s.safety.apnea = "twijfel";
  assert.match(careMessages(s).join(" "), /niet autorijden/);
  assert.match(careMessages(s).join(" "), /huisarts/);
  assert.equal(checkReady(s), false);
});
test("zero actions or missing details cannot generate plan success", () => {
  const s = plan();
  assert.equal(planReady(s), true);
  s.details.rise.time = "";
  assert.equal(planReady(s), false);
  assert.match(planText(s), /nog geen compleet/);
  s.details.rise.time = "25:00";
  assert.equal(planReady(s), false);
  resetPlan(s);
  assert.equal(maxStep(s), 4);
  assert.equal(planReady(s), false);
});
test("maximum two actions, no duplicates or actions from another topic", () => {
  const s = plan();
  assert.equal(selectAction(s, "light"), true);
  assert.equal(selectAction(s, "discuss"), false);
  assert.equal(selectAction(s, "breathe"), false);
  assert.equal(s.actions.length, 2);
  selectAction(s, "rise");
  assert.deepEqual(s.actions, ["light"]);
  assert.equal(selectAction(s, "discuss"), true);
});
test("evaluation starts empty and changes invalidate the previous review", () => {
  const s = plan();
  assert.deepEqual(s.evaluation, { feasible: "", change: "", next: "" });
  assert.equal(followup(s), "");
  s.evaluation = {
    feasible: "Nog niet geprobeerd",
    change: "Nog niet te zeggen",
    next: "Mijn stap kleiner maken",
  };
  assert.match(followup(s), /geen effect/);
  selectAction(s, "light");
  assert.deepEqual(s.evaluation, initialState().evaluation);
});
test("saved choices roundtrip while free text and unsafe keys do not survive", () => {
  const s = plan();
  s.step = 5;
  s.startDate = "2026-09-11";
  const hydrated = restore(
    JSON.stringify({
      ...s,
      privateText: "Secret",
      exercise: { worry: "Secret" },
    }),
  );
  assert.equal(planReady(hydrated), true);
  assert.equal(hydrated.step, 5);
  assert.doesNotMatch(JSON.stringify(hydrated), /Secret/);
  assert.equal(restore("{broken"), null);
  assert.equal(restore('{"version":1}'), null);
});
test("tampered saved plans cannot skip mandatory check, topic or action limits", () => {
  const s = plan();
  delete s.safety.apnea;
  s.step = 6;
  assert.equal(restore(JSON.stringify(s)).step, 2);
  const v = plan();
  v.actions = ["rise", "light", "discuss", "__proto__"];
  const loaded = restore(JSON.stringify(v));
  assert.equal(loaded.actions.length, 2);
  assert.equal(loaded.step, 1);
  v.topic = "__proto__";
  assert.equal(restore(JSON.stringify(v)).topic, "");
});
test("referral values are allowlisted and never import personal URL data", () => {
  assert.equal(referral("?source=fysionair&sleep=INVALID&focus=ritme"), "");
  assert.equal(referral("?source=fysionair&sleep=high&focus=__proto__"), "");
  assert.equal(
    referral("?source=fysionair&sleep=high&focus=inslapen&name=Secret"),
    "inslapen",
  );
});
