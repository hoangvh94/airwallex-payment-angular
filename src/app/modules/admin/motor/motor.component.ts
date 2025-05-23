import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VehicleComponent } from './vehicle/vehicle.component';

@Component({
    selector: 'app-motor-forms',
    templateUrl: './motor.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, VehicleComponent],
})
export class MotorComponent {

    showVehiclePopup = false;

    openVehiclePopup() {
        this.showVehiclePopup = true;
    }

    closeVehiclePopup() {
        this.showVehiclePopup = false;
    }

}
