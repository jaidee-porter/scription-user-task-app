import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '@take-home/shared';
import { StorageService } from '../storage/storage.service';
import Fuse from 'fuse.js';

@Injectable({ providedIn: 'root' })
export class TasksService {
  tasks: Task[] = [];

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  getTasksFromApi(): Observable<Task[]> {
    const endpointUrl = '/api/tasks';
    return this.http.get<Task[]>(endpointUrl);
  }

  async getTasksFromStorage(): Promise<void> {
    this.tasks = await this.storageService.getTasks();
    this.filterTask('isArchived');
  }

  filterTask(key: keyof Task): void {
    switch (key) {
      case 'isArchived':
        this.tasks = this.tasks.filter((task) => !task.isArchived);
        break;
      case 'priority':
        // Filter for tasks with High Priority
        this.tasks = this.tasks.filter((task) => task.priority === 'HIGH');
        break;
      case 'scheduledDate':
        // Filter for tasks Due Today
        let currentDate = new Date();
        this.tasks = this.tasks.filter((task) => {
          let taskDate = new Date(task.scheduledDate);
          return taskDate.getDate() === currentDate.getDate() &&
            taskDate.getMonth() === currentDate.getMonth() &&
            taskDate.getFullYear() === currentDate.getFullYear();
        });
        break;
      case 'completed':
        this.tasks = this.tasks.filter((task) => !task.completed);
    }
  }

  searchTask(search: string): void {
    if (search) {
      const options = {
        keys: Object.keys(this.tasks[0]),  
        threshold: 0.5,
        caseSensitive: false,
        includeScore: true,
        includeSort: true
      }

      const fuse = new Fuse(this.tasks, options);
      const results = fuse.search(search)
      this.tasks = results.map((r) => r.item);
    } else {
      // Reload all tasks from storage
      this.getTasksFromStorage();
    }
  }
}
