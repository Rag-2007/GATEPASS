import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";

interface Hostel {
    Block_Id: string;
    CareTaker_ID: string;
    Warden_ID: string;
}

@Injectable()
export class HostelRepository {

    private filePath = path.join(
        process.cwd(),
        'database',
        'hostels.json',
    );

    private async readHostels(): Promise<Hostel[]> {
        const data = await fs.readFile(
            this.filePath,
            'utf-8',
        );

        return JSON.parse(data);
    }

    private async writeHostels(hostels: Hostel[]) {
        await fs.writeFile(
            this.filePath,
            JSON.stringify(
                hostels,
                null,
                2,
            ),
        );
    }

    async findById(blockId: string){
        const hostels = await this.readHostels();
        return hostels.find(h => h.Block_Id === blockId);
    }

    async addHostel(hostel: Hostel){
        const hostels = await this.readHostels();
        hostels.push(hostel);
        await this.writeHostels(hostels);
    }

    async deleteHostel(blockId: string){
        const hostels = await this.readHostels();
        const updated = hostels.filter(h => h.Block_Id !== blockId);
        await this.writeHostels(updated);
    }

    async updateHostel(blockId: string,updatedData: Partial<Hostel>){
        const hostels = await this.readHostels();
        const index = hostels.findIndex(h => h.Block_Id === blockId);
        if (index === -1) {
            return null;
        }
        hostels[index] = {...hostels[index],...updatedData};
        await this.writeHostels(hostels);
        return hostels[index];
    }

    async getAll() {
        return await this.readHostels();
    }

}