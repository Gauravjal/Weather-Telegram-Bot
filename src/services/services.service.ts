import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users: any[] = []; // This should ideally be replaced with a database service

  // Save or update a user in the database
  saveOrUpdateUser(user: any): void {
    // In a real application, this method would interact with a database
    // For simplicity, we're just storing users in an array here
    const existingUserIndex = this.users.findIndex(u => u.id === user.id);

    if (existingUserIndex !== -1) {
      // Update existing user
      this.users[existingUserIndex] = user;
    } else {
      // Save new user
      this.users.push(user);
    }
  }

  // Get user by ID
  getUserById(userId: string): any {
    // In a real application, this method would fetch the user from the database
    // For simplicity, we're just searching in the array here
    return this.users.find(user => user.id === userId);
  }

  // Get all users
  getAllUsers(): any[] {
    // In a real application, this method would fetch all users from the database
    // For simplicity, we're returning the array here
    return this.users;
  }
}
