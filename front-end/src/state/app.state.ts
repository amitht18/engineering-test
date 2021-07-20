import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"
import create from "zustand"

export interface StaffState {
    students: Person[];
    filteredStudents: Person[];
    updateStudentRollState: (students: Person[], id: number, roll_state: RolllStateType) => void;
    updateStudents: (students: Person[]) => void;
    filterStudentByAttendanceType: (students: Person[], type: RolllStateType | "all") => void;
}

export const useStore = create<StaffState>(set => ({
    students: [],
    filteredStudents: [],
    updateStudents: (students) => set(state => ({ students })),
    updateStudentRollState: (students, id, roll_state) => set(state => ({
        students: getNewState(students, id, roll_state)
    })),
    filterStudentByAttendanceType: (students, type) => set(state => ({
        filteredStudents: getFilteredByAttendance(students, type)
    }))
}))


function getNewState(students: Person[], id: number, roll_state: RolllStateType): Person[] {
    return [...students].map((student) => {
        return student.id === id ? { ...student, roll_state } : { ...student };
    })
}

function getFilteredByAttendance(students: Person[], roll_state: RolllStateType | "all"): Person[] {
    if (roll_state === "all") {
        return [...students];
    } else {
        return [...students].filter(student => student.roll_state === roll_state);
    }
}
