import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MotorAiService } from 'app/core/ai/ai-motor.service';
import { Motor } from 'app/core/ai/motor-api.types';

@Component({
    selector: 'app-vehicle',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './vehicle.component.html',
})
export class VehicleComponent implements OnInit {
    selectedOption: string = 'vin';
    vinForm: FormGroup;
    deepCheckForm: FormGroup;
    years = [];
    makes = [];
    models = [];
    submodels = [];
    engines = [];
    vehicleId: number;
    makeName = '';

    constructor(
        private fb: FormBuilder,
        private motorAiService: MotorAiService,
        private router: Router
    ) {
        // VIN form
        this.vinForm = this.fb.group({
            vin: ['', Validators.required],
        });

        // Deep Check form
        this.deepCheckForm = this.fb.group({
            year: ['', Validators.required],
            make: ['', Validators.required],
            model: ['', Validators.required],
            submodel: ['', Validators.required],
            engine: ['', Validators.required],
        });
    }

    addVehicle() {
        if (this.selectedOption === 'vin') {
            if (this.vinForm.valid) {
                this.onVinSubmit();
            } else {
                this.vinForm.markAllAsTouched();
            }
        } else {
            if (this.deepCheckForm.valid) {
                this.onDeepCheckSubmit();
            } else {
                this.deepCheckForm.markAllAsTouched();
            }
        }
    }
    ngOnInit(): void {
        this.getYear();
        this.selectYear();
        this.selectMake();
        this.selectModel();
        // this.selectYear();
        // this.selectEngine();
    }

    selectYear() {
        this.deepCheckForm
            .get('year')
            ?.valueChanges.subscribe((selectedYear) => {
                console.log('Selected year:', selectedYear);
                this.getMake(selectedYear);
                this.makes = [];
                this.models = [];
                this.submodels = [];
                this.engines = [];
            });
    }

    selectMake() {
        this.deepCheckForm
            .get('make')
            ?.valueChanges.subscribe((selectedMake) => {
                console.log('Selected make:', selectedMake);
                this.models = [];
                this.submodels = [];
                this.engines = [];
                this.getModel(
                    this.deepCheckForm.controls.year.value,
                    selectedMake
                );
            });
    }

    selectModel() {
        this.deepCheckForm
            .get('model')
            ?.valueChanges.subscribe((selectModel) => {
                console.log('Selected model:', selectModel);
                this.engines = [];
                this.submodels = this.models.find(
                    (m) => m.ModelID == selectModel
                ).SubModels;
                this.getEngine(
                    this.deepCheckForm.controls.year.value,
                    this.deepCheckForm.controls.make.value,
                    selectModel
                );
            });
    }

    onVinSubmit() {
        const vin = this.vinForm.value.vin;
        this.motorAiService.submitVin(vin).subscribe({
            next: (res: Motor<any>) => {
                if (res.status === HttpStatusCode.Ok) {
                    // this.router.navigate(['apps/motor/product'], {
                    //     queryParams: { id: res.data.id, type: 0 },
                    // });
                    this.router.navigate(['apps/motor/warm-up'], {
                        queryParams: { id: res.data.id, type: 0 },
                    });
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    getYear() {
        this.motorAiService.getYears().subscribe({
            next: (res: Motor<any>) => {
                if (res.status === HttpStatusCode.Ok) {
                    this.years = res.data;
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
    getMake(year: string) {
        this.motorAiService.getMakes(year).subscribe({
            next: (res: Motor<any>) => {
                if (res.status === HttpStatusCode.Ok) {
                    this.makes = res.data;
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
    getModel(year: string, makeId: string) {
        this.motorAiService.getModels(year, makeId).subscribe({
            next: (res: Motor<any>) => {
                if (res.status === HttpStatusCode.Ok) {
                    this.models = res.data;
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
    getSubmodel() {}

    getEngine(year: string, makeId: string, modelId: string) {
        this.motorAiService.getEngines(year, makeId, modelId).subscribe({
            next: (res: Motor<any>) => {
                if (res.status === HttpStatusCode.Ok) {
                    this.engines = res.data.engine_info;
                    this.vehicleId = res.data.vehicle_id;
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    onDeepCheckSubmit() {
        const formValues = this.deepCheckForm.value;
        if (this.deepCheckForm.invalid) {
            this.deepCheckForm.markAllAsTouched(); // mark fields so validation styles show up
            console.warn('Form is incomplete.');
            return;
        }

        const selectId =
            Object.values(formValues).join('_') + '_' + this.vehicleId;
        const selectedMakeObj = this.makes.find(
            (m) => m.MakeID == formValues.make
        );
        const selectedMakeName = selectedMakeObj?.MakeName || 'Unknown';
        console.log('Deep Check Submitted:', selectId);

        this.motorAiService.submitSelect(selectId, selectedMakeName).subscribe({
            next: (res: Motor<any>) => {
                if (res.status === HttpStatusCode.Ok) {
                    // this.router.navigate(['apps/motor/product'], {
                    //     queryParams: { id: res.data.id, type: 1 },
                    // });
                    this.router.navigate(['apps/motor/warm-up'], {
                        queryParams: { id: res.data.id, type: 1 },
                    });
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
