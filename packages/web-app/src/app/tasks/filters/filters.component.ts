import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Task } from '@take-home/shared';
import { MatChipSelectionChange } from '@angular/material/chips';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
    selector: 'take-home-filters-component',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    animations: [
      trigger('slideInOut', [
        transition(':enter', [
          style({transform: 'translateX(-100%)'}),
          animate('200ms ease-in', style({transform: 'translateX(0%)'}))
        ]),
        transition(':leave', [
          animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
        ])
      ])
    ],
    standalone: false
})
export class FiltersComponent {
  constructor(protected tasksService: TasksService) {}

  showFilters = false;

  updateFilterVisibility(): void {
    this.showFilters = !this.showFilters;
  }

  filterTask(field: keyof Task, event: MatChipSelectionChange) {
    if (event.selected) {
      this.tasksService.filterTask(field);
    } else {
      this.tasksService.getTasksFromStorage();
    }
  }
}
