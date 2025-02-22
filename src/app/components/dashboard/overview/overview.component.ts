import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  template: `
    <div class="overview-container">
      <h1>Dashboard Overview</h1>
      <p>Welcome to the Poker Management System</p>
    </div>
  `,
  styles: [`
    .overview-container {
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
  `]
})
export class OverviewComponent {} 