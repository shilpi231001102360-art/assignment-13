
import { describe, it, expect } from "vitest";

import { createAppStore } from "./store";

import {
  addStudent,
  updateStudent,
  deleteStudent,
  setFilter,
  selectFilteredStudents,
  selectReportStats
} from "./store";

describe("Attendly Redux Store", () => {

  it("creates all three Redux slices", () => {
    const store = createAppStore();
    const state = store.getState();

    expect(state.students).toBeDefined();
    expect(state.attendance).toBeDefined();
    expect(state.filters).toBeDefined();
  });

  it("adds a new student", () => {
    const store = createAppStore();

    store.dispatch(addStudent({
      id: "TEST901",
      name: "Test Student",
      email: "test@example.com",
      department: "CSE",
      semester: "1",
      section: "A"
    }));

    expect(
      store.getState().students.items.some(
        s => s.id === "TEST901"
      )
    ).toBe(true);
  });

  it("updates student details", () => {
    const store = createAppStore();

    const student = store.getState().students.items[0];

    store.dispatch(updateStudent({
      ...student,
      name: "Updated Name"
    }));

    expect(store.getState().students.items[0].name)
      .toBe("Updated Name");
  });

  it("deletes a student", () => {
    const store = createAppStore();

    const id = store.getState().students.items[0].id;

    store.dispatch(deleteStudent(id));

    expect(
      store.getState().students.items.some(s => s.id === id)
    ).toBe(false);
  });

  it("filters students by department", () => {
    const store = createAppStore();

    store.dispatch(setFilter({
      key: "department",
      value: "CSE"
    }));

    const result = selectFilteredStudents(store.getState());

    expect(result.every(s => s.department === "CSE")).toBe(true);
  });

  it("starts with 45 percent attendance threshold", () => {
    const store = createAppStore();

    expect(store.getState().filters.threshold).toBe(45);
  });

  it("calculates empty attendance report", () => {
    const store = createAppStore();

    const stats = selectReportStats(store.getState());

    expect(stats.total).toBe(0);
    expect(stats.present).toBe(0);
    expect(stats.absent).toBe(0);
    expect(stats.percentage).toBe(0);
  });

});
