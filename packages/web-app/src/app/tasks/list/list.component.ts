import { Component } from '@angular/core';

import { Task } from '@take-home/shared';
import { take } from 'rxjs';
import { TasksService } from '../tasks.service';
import { Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';

@Component({
    selector: 'take-home-list-component',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: false
})
export class ListComponent {
  constructor(
    private storageService: StorageService,
    protected tasksService: TasksService,
    private router: Router,
  ) {
    this.getTaskList();
  }

  onDoneTask(item: Task): void {
    // Mark task as completed
    item.completed = true;
    // Save updated task to storage
    this.storageService.updateTaskItem(item);
    throw new Error('Not implemented');
  }

  onDeleteTask(item: Task): void {
    // Mark task as archived
    item.isArchived = true;
    // Save updated task to storage
    this.storageService.updateTaskItem(item);
    // Refresh the task list without including archived items
    this.getTaskList();
  }

  onAddTask(): void {
    // Navigate to the add task form
    this.router.navigate(['add']);
  }

  private getTaskList(): void {
    this.tasksService
      .getTasksFromApi()
      .pipe(take(1))
      .subscribe(async (tasks) => {
        tasks.forEach(async (task) => {
          await this.storageService.updateTaskItem(task);
        });
        await this.tasksService.getTasksFromStorage();
      });
  }
}
