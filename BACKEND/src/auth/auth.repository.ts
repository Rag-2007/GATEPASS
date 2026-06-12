import { NotFoundException, Injectable } from "@nestjs/common";
import { promises as fs } from 'fs';
import * as path from 'path';

export interface User {
    USER_ID: string;
    Name: string;
    Email: string;
    PhoneNo: string;
    Role: string;
    Password_Hash: string;
    RefreshToken: string | null;
}


@Injectable()
export class AuthRepository{
    private filePath = path.join(
        process.cwd(),
        'database',
        'users.json',
    );

    private async readUsers():Promise<User[]>{
        const data = await fs.readFile(
            this.filePath,
            'utf-8',
        );

        return JSON.parse(data);
    }

    private async writeUsers(users: any[]) {
        await fs.writeFile(
            this.filePath,
            JSON.stringify(users, null, 2),
        );
    }

    async findUserByEmail(email: string):Promise<User> {
        const users = await this.readUsers();
        const user = users.find(u => u.Email === email);
        if(!user){
            throw new NotFoundException("User Not Found") ;
        }
        return user ;
    }


    async createUser(userData: any) {
        const users = await this.readUsers();
        const nextId = users.length === 0 ? 1: Math.max(...users.map(u => Number(u.USER_ID))) + 1;
        const user = {USER_ID: String(nextId),...userData};
        users.push(user);
        await this.writeUsers(users);
        return nextId;
    }
    
    async deleteUser(userId: string) {
        const users = await this.readUsers();
        const updatedUsers = users.filter(u => u.USER_ID !== userId);
        await this.writeUsers(updatedUsers);
    }

    async updateUser(userId: string,updatedData: any){
        const users = await this.readUsers();
        const index = users.findIndex(u => u.USER_ID === userId);
        if (index === -1) {
            return null;
        }
        users[index] = {...users[index],...updatedData};
        await this.writeUsers(users);
        return users[index];
    }

    async findOne(email:string,role:string):Promise<string | null> {
        const users = await this.readUsers();
        const user = users.find(u => u.Email === email && u.Role === role);
        return user ? user.Password_Hash:null;
    }

    async findUID(email: string): Promise<string | null> {
        const users = await this.readUsers();
        const user = users.find(u => u.Email === email);
        return user? user.USER_ID: null;
    }

    async setRefreshToken(UserID: string,hash: string){
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === UserID);
        if (user) {
            user.RefreshToken = hash;

            await this.writeUsers(users);
        }
    }

    async deleteToken(UserID: string){
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === UserID);
        if (user) {
            user.RefreshToken = null;

            await this.writeUsers(users);
        }
    }

    async findRole(userid: string): Promise<string | null> {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === userid);
        return user? user.Role: null;
    }

    async findEmail(userid: string):Promise<string | null> {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === userid,);
        return user? user.Email: null;
    }

    async getRefreshToken(userid: string): Promise<string | null> {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === userid);
        return user? user.RefreshToken: null;
    }

    async findUserById(userId: string) {
        const users = await this.readUsers();
        return users.find(u => u.USER_ID === userId);
    }

}
