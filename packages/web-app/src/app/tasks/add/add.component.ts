import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, TaskPriority } from '@take-home/shared';
import { StorageService } from '../../storage/storage.service';
import { faker } from '@faker-js/faker';

@Component({
    selector: 'take-home-add-component',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    standalone: false
})
export class AddComponent {
  protected addTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      // Validate that the title field has at least 10 characters
      Validators.required,
      Validators.minLength(10)
    ]),
    description: new FormControl(null),
    date: new FormControl(null, [
      Validators.required
    ]),
    priority: new FormControl(
      { value: TaskPriority.MEDIUM, disabled: false },
      {
        validators: Validators.required,
      },
    ),
  });
  protected priorities = Object.values(TaskPriority);

  constructor(private storageService: StorageService, private router: Router) {}

  onSubmit() {
    const newTask: Task = {
      ...this.addTaskForm.getRawValue(),
      uuid: faker.string.uuid(),
      isArchived: false,
      scheduledDate: this.addTaskForm.getRawValue().date,
    };

    // Save updated task to storage
    this.storageService.addTaskItem(newTask);
    // Navigate to home page
    this.router.navigateByUrl('/');
  }

  onCancel(): void {
    // Navigate to home page
    this.router.navigateByUrl('/');
  }
}
