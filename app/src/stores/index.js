import UserModel from './User';
import CommandsModel from './Commands';

const UserStore = new UserModel();
const CommandsStore = new CommandsModel();
CommandsStore.init();

export {
  UserStore,
  CommandsStore
};