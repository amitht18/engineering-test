import React, { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/ButtonBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles";
import { Colors } from "shared/styles/colors";
import { CenteredContainer } from "shared/components/centered-container/centered-container.component";
import { Person, PersonHelper } from "shared/models/person";
import { useApi } from "shared/hooks/use-api";
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component";
import {
  ActiveRollOverlay,
  ActiveRollAction
} from "staff-app/components/active-roll-overlay/active-roll-overlay.component";
import { SortOrder } from "shared/models/roll";
import { debounce } from "shared/helpers/debounce";
import { getSortedList } from "shared/helpers/data-generation";
import { useStore } from "state/app.state";

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false);
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({
    url: "get-homeboard-students"
  });
  const [sortedList, updateSortedList] = useState<Person[]>([]);
  const [sortOrder, updateSortOrder] = useState<SortOrder>("asc");
  const [sortByLastName, updateSortByLastName] = useState<boolean>(false);
  const [showSortOptions, updateShowSortOptions] = useState<boolean>(false);
  const updateStudents = useStore(state => state.updateStudents);
  const students = useStore(state => state.students);
  const filteredByTypeList = useStore(state => state.filteredStudents);

  function handleCheck() {
    updateSortByLastName(sortByLastName ? false : true);
  }

  useEffect(() => {
    void getStudents();
  }, [getStudents]);

  useEffect(() => {
    updateSortedList(students)
  }, [students])

  useEffect(() => {
    if(data) {
      updateStudents(data.students);
    }
  }, [data, updateStudents]);

  useEffect(() => {
    if(filteredByTypeList.length > 0) {
      updateSortedList(filteredByTypeList)
    }
  }, [filteredByTypeList])

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const filteredList = students.filter(word => PersonHelper.getFullName(word).toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
    if (filteredList) {
      debounce(updateSortedList(filteredList), 300);
    }
  }

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true);
    }
    if (action === "sort") {
      if(data) {
        const tempSortedList = getSortedList(sortedList, sortOrder, sortByLastName ? "last_name" : "first_name");
        updateSortedList(tempSortedList);
      }
      updateSortOrder(sortOrder === "asc" ? "desc": "asc");
      updateShowSortOptions(true);
    }
  };

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false);
    }
  };

  return (
    <>
      <S.PageContainer>
        <Toolbar
        onItemClick={onToolbarAction}
        handleSearch={handleSearch}
        handleCheck={handleCheck}
        sortByLastName={sortByLastName}
        showSortOptions={showSortOptions}
        sortOrder={sortOrder}
        showSortIcon={showSortOptions}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && sortedList && (
          <>
            {sortedList?.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
      />
    </>
  );
};

type ToolbarAction = "roll" | "sort";
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  handleCheck: () => void
  sortByLastName: boolean;
  showSortOptions: boolean;
  sortOrder: SortOrder;
  showSortIcon: boolean;
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props;

  return (
    <S.ToolbarContainer>
      <div>
        <div onClick={() => onItemClick("sort")} style={{cursor: "pointer"}}>First Name {props.showSortIcon && (props.sortOrder === "asc" 
        ? <span>&#9660;</span>
        : <span>&#9650;</span>)
        }</div>
        {props.showSortOptions && <div className="sort-option" onClick={props.handleCheck}>
          <input type="checkbox" name="sort_by_last_name" checked={props.sortByLastName} />
          <label htmlFor="sort_by_last_name" style={{fontSize: "12px"}}>Sort by last name</label>  
        </div>}
      </div>
      <S.Input
        placeholder="Search"
        onChange={(e) => props.handleSearch(e)}
      ></S.Input>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  );
};

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Input: styled.input`
    width: 25%;
    height: 30px;
    border: 2px solid #fff;
    border-radius: ${BorderRadius.default};
    padding: 5px 10px;
  `
};
