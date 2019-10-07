import { Component, OnInit } from '@angular/core';
import restaurantData from './restaurants.json';
import closedRestaurantData from './closedRestaurants.json';

@Component({
  selector: 'app-lunch-helper',
  templateUrl: './lunch-helper.component.html',
  styleUrls: ['./lunch-helper.component.css']
})
export class LunchHelperComponent implements OnInit {
  Restaurants: any = restaurantData;

  ClosedRestaurants: any = closedRestaurantData;

  vegetarianComing = false;
  leaveEarly = false;
  backEarly = false;
  areWeDrinking = false;

  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  todaysDate = new Date();
  dayName = this.dayNames[this.todaysDate.getDay()];

  ngOnInit() {
    for (var i = 0; i < restaurantData.length; i++) {
      var j = 0;

      if (restaurantData[i].closedDays) {
        for (j = 0; j < restaurantData[i].closedDays.length; j++) {
          if (restaurantData[i].closedDays[j] == this.dayName) {
            restaurantData[i].isClosed = true;
          }
        }
      }

      if (restaurantData[i].specialDays) {
        for (j = 0; j < restaurantData[i].specialDays.length; j++) {
          if (restaurantData[i].specialDays[j] == this.dayName) {
            restaurantData[i].hasSpecials = true;
          }
        }
      }

      restaurantData[i].isViable = this.calculateRestaurantViability(restaurantData[i]);
    }
  }

  public updateRejected(i) {
    restaurantData[i].isRejected = !restaurantData[i].isRejected;
    this.updateViabilities();
  }

  public updateForVegetarians() {
    this.vegetarianComing = !this.vegetarianComing;
    this.updateViabilities();
  }

  public updateForDrinking() {
    this.areWeDrinking = !this.areWeDrinking;
    this.updateViabilities();
  }

  public updateForReturningAtOne() {
    this.backEarly = !this.backEarly;
    this.updateViabilities();
  }

  public updateForLeavingEarly() {
    this.leaveEarly = !this.leaveEarly;
    this.updateViabilities();
  }

  updateViabilities() {
    for (var i = 0; i < restaurantData.length; i++) {
      restaurantData[i].isViable = this.calculateRestaurantViability(restaurantData[i]);
    }
  }

  calculateRestaurantViability(restaurantData) {
    if (restaurantData.isRejected) {
      restaurantData.message = 'Rejected';
      return false;
    }

    if (restaurantData.isClosed) {
      restaurantData.message = 'Closed today';
      return false;
    }

    if (this.vegetarianComing && restaurantData.vegetarianFriendly == false) {
      restaurantData.message = 'Nothing for vegetarians';
      return false;
    }

    if (this.areWeDrinking && restaurantData.hasBooze == false) {
      restaurantData.message = 'No booze';
      return false;
    }

    if (!this.leaveEarly && restaurantData.needToLeaveEarly == true) {
      restaurantData.message = 'We won\'t get a table';
      return false;
    }

    if ((!this.leaveEarly && this.backEarly) && (restaurantData.close == false || restaurantData.slow == true)) {
      restaurantData.message = 'Too slow';
      return false;
    }

    restaurantData.message = ' ';
    return true;
  }
}
