import UserFactory from "./routes/user/User";
import IllustrationFactories from "./routes/illustration/models";

import { sequelize } from "./config/db";

const modelsFactories = [UserFactory, ...IllustrationFactories];

modelsFactories.forEach((model) => {
  model.init(sequelize);
});

modelsFactories.forEach((model) => {
  model.associate(sequelize.models);
});

export { User } from "./routes/user/User";
export {
  Illustration,
  Like,
  IllustrationImages,
} from "./routes/illustration/models";
