import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useStore } from "state/app.state"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick } = props
  const students = useStore(state => state.students);
  const [allStudentsCount, updateAllStudentsCount] = useState<number>(0)
  const [presentStudentsCount, updatePresentStudentsCount] = useState<number>(0)
  const [lateStudentsCount, updateLateStudentsCount] = useState<number>(0)
  const [absentStudentsCount, updateAbsentStudentsCount] = useState<number>(0)

  useEffect(() => {
    updateLateStudentsCount(0);
    updatePresentStudentsCount(0);
    updateAbsentStudentsCount(0);
    updateAbsentStudentsCount(students.filter((student) => student.roll_state === "absent").length);
    updatePresentStudentsCount(students.filter((student) => student.roll_state === "present").length);
    updateLateStudentsCount(students.filter((student) => student.roll_state === "late").length);
    updateAllStudentsCount(students.length);
  }, [students])

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: allStudentsCount },
              { type: "present", count: presentStudentsCount },
              { type: "late", count: lateStudentsCount },
              { type: "absent", count: absentStudentsCount },
            ]}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("exit")}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
