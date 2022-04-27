import UserFactory from "./routes/user/User";
import IllustrationFactory from "./routes/illustration/Illustration";

import { sequelize } from "./config/db";

const modelsFactories = [UserFactory, IllustrationFactory];

modelsFactories.forEach((model) => {
  model.init(sequelize);
});

modelsFactories.forEach((model) => {
  model.associate(sequelize.models);
});

export { User } from "./routes/user/User";
export { Illustration } from "./routes/illustration/Illustration";
