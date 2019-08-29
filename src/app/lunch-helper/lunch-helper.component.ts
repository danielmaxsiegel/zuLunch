import { Component, OnInit } from '@angular/core';
import restaurantData from './restaurants.json';

@Component({
  selector: 'app-lunch-helper',
  templateUrl: './lunch-helper.component.html',
  styleUrls: ['./lunch-helper.component.css']
})
export class LunchHelperComponent implements OnInit {
  Restaurants: any = restaurantData;

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
    if (restaurantData.isClosed) {
      return false;
    }

    if (this.vegetarianComing && restaurantData.vegetarianFriendly == false) {
      return false;
    }

    if (this.areWeDrinking && restaurantData.hasBooze == false) {
      return false;
    }

    if (!this.leaveEarly && restaurantData.needToLeaveEarly == true) {
      return false;
    }

    if ((!this.leaveEarly && this.backEarly) && (restaurantData.close == false || restaurantData.slow == true)) {
      return false;
    }

    return true;
  }
}
