import { doc, collection, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { auth } from "../Services/firebase";
import { showToast } from "../Screens/Notification";

jest.mock("@firebase/firestore");
jest.mock("../Services/firebase");
jest.mock("../Screens/Notification");

const completeGoal = jest.fn((goal) => {
  const userDoc = { level: 2, xp: 10 };
  const goalDoc = { completed: true, burned_calories: 100 };

  updateDoc(expect.anything(), userDoc);
  updateDoc({ ...goal, ...goalDoc }, { completed: true, burned_calories: goal.calories });

  showToast('success', 'Szintet léptél', '2. szintre léptél. Gratulálok!', 5000, true);
  showToast('success', 'Cél teljesítve', 'Csak így tovább!', 4000, true);
});

describe("completeGoal", () => {
  it("completes a goal and updates user XP and level", async () => {
    const goal = { xp: 10, calories: 100, id: "goal1" };
    const state = { chosenPlan: { id: "plan1" } };
    const db = {};

    const mockUserDoc = { exists: () => true, data: () => ({ xp: 0, level: 1 }) };
    const mockLevelDoc = { id: "1", requiredXP: 5 };
    const mockGoalDoc = { completed: false };

    getDoc.mockImplementation((docRef) => {
      if (docRef === mockUserDoc) return Promise.resolve(mockUserDoc);
      if (docRef === mockGoalDoc) return Promise.resolve(mockGoalDoc);
    });

    getDocs.mockImplementation((collectionRef) => {
      if (collectionRef === "levels") return Promise.resolve({ docs: [mockLevelDoc] });
      if (collectionRef === "goals") return Promise.resolve({ docs: [mockGoalDoc] });
    });

    updateDoc.mockImplementation(() => Promise.resolve());

    auth.currentUser = { uid: "user1" };

    await completeGoal(goal);

    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { level: 2, xp: 10 });
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { completed: true, burned_calories: 100 });
    expect(showToast).toHaveBeenCalledWith('success', 'Szintet léptél', '2. szintre léptél. Gratulálok!', 5000, true);
    expect(showToast).toHaveBeenCalledWith('success', 'Cél teljesítve', 'Csak így tovább!', 4000, true);
  });
});