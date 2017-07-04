import {CommandsStore} from "./index";

describe("CommandsModel", () => {
    it("dispatches", () => {
        CommandsStore.setStatus(true);
        expect(CommandsStore.status).toBe(true);
    });

    it("dispatches", () => {
        CommandsStore.setQueue(10, 1);
        expect(CommandsStore.percent).toBe(90);
    });
});