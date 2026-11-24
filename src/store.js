import { configureStore, createSlice } from "@reduxjs/toolkit";

const savedStudents = JSON.parse(
  localStorage.getItem("students") || "[]"
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: savedStudents,
  },
  reducers: {
    addStudent: (state, action) => {
      const exists = state.students.some(
        (s) => s.studentId === action.payload.studentId
      );

      if (!exists) {
        state.students.push(action.payload);
      }
    },

    updateStudent: (state, action) => {
      const index = state.students.findIndex(
        (s) => s.studentId === action.payload.studentId
      );

      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },

    deleteStudent: (state, action) => {
      state.students = state.students.filter(
        (s) => s.studentId !== action.payload
      );
    },
  },
});

export const {
  addStudent,
  updateStudent,
  deleteStudent,
} = studentSlice.actions;

export const store = configureStore({
  reducer: {
    students: studentSlice.reducer,
  },
});

store.subscribe(() => {
  localStorage.setItem(
    "students",
    JSON.stringify(store.getState().students.students)
  );
});