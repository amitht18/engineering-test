import { getRandomInt, generateRange } from "shared/helpers/math-utils"
import { Person } from "shared/models/person"
import { SortOrder } from "shared/models/roll"

const nameTokens = ["Alan", "John", "Brandon", "Key", "Branda", "Morris", "Carlos", "Lee"]

export function generateStudent(id: number) {
  return {
    id,
    first_name: nameTokens[getRandomInt(0, nameTokens.length - 1)],
    last_name: nameTokens[getRandomInt(0, nameTokens.length - 1)],
  }
}

export function generateStudents(number: number) {
  return generateRange(number).map((_, id) => generateStudent(id + 1))
}

export function getSortedList(list: Person[], order: SortOrder, key: "first_name" | "last_name"): Person[] {
  return [...list].sort((a, b) => {
    if (order === "asc") {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
}
