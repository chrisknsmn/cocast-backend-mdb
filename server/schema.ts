import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
  },
  {
    methods: {
      getName() {
        console.log(`${this.name}!`);
      },
    },
  }
);

export type User = mongoose.Document & {
  name: string;
  getName(): void;
};

export const User = mongoose.model<User>('User', userSchema);