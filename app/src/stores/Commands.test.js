import {CommandsStore} from "./index";

describe("CommandsStore", () => {
    it("dispatches", () => {
        CommandsStore.setStatus(true);
        expect(CommandsStore.status).toBe(true);
    });

    it("percentage 90", () => {
        CommandsStore.setQueue(10, 1);
        expect(CommandsStore.percent).toBe(90);
    });

    it("percentage 100", () => {
        CommandsStore.setQueue(0, 0);
        expect(CommandsStore.percent).toBe(100);
    });

    it("percentage 0", () => {
        CommandsStore.setQueue(10, 0);
        expect(CommandsStore.percent).toBe(100);
    });
});