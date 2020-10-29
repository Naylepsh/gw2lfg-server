import { LIRequirement } from "../../../models/requirements/li-requirement.model";
import { IGW2APIService } from "../../../services/gw2-api/gw2.service.interface";
import { Item } from "../../../services/gw2-items/item.interface";

const itemNameToId: Record<string, string> = {};
itemNameToId[LIRequirement.itemName] = "1";

class FakeGw2Service implements IGW2APIService {
  constructor(public items: Item[]) {}

  getItem(name: string, _: string) {
    // ignoring name to id conversion
    const itemId = itemNameToId[name];
    const items = this.items.filter((item) => item.id === itemId);
    return items[0];
  }
}

const makeRequirementAndService = (requiredLi: number, ownedLi: number) => {
  const items = [{ id: itemNameToId[LIRequirement.itemName], count: ownedLi }];
  const gw2service = new FakeGw2Service(items);
  const requirement = new LIRequirement(requiredLi);

  return { requirement, gw2service };
};

describe("Requirement tests", () => {
  it("should throw an error when attempting to create a LI requirement with negative quantity", () => {
    const quantity = -1;

    expect(() => new LIRequirement(quantity)).toThrow();
  });

  it("should satisfy the li requirement when real quantity is greater or equal to that required", () => {
    const requiredLi = 10;
    const ownedLi = requiredLi + 1;
    const { requirement, gw2service } = makeRequirementAndService(
      requiredLi,
      ownedLi
    );

    const hasEnoughItems = requirement.isSatisfied("fake-api-key", gw2service);

    expect(hasEnoughItems).toBeTruthy();
  });

  it("should not satisfy the li requirement when real quantity is lower than required", () => {
    const requiredLi = 10;
    const ownedLi = requiredLi - 1;
    const { requirement, gw2service } = makeRequirementAndService(
      requiredLi,
      ownedLi
    );

    const hasEnoughItems = requirement.isSatisfied("fake-api-key", gw2service);

    expect(hasEnoughItems).toBeFalsy();
  });
});
