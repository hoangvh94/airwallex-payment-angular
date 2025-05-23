import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MotorAiService } from 'app/core/ai/ai-motor.service';
import { Motor } from 'app/core/ai/motor-api.types';
import { SubmidialogComponent } from './submit/submit-dialog.component';

@Component({
    selector: 'app-warm-up',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './warm-up.component.html',
})
export class WarmUpComponent implements OnInit {
    id: string = ''; // Store the VIN from the query parameters
    type: number = 0; //vin 1://select;
    vehicleInfo: any;
    makeName = '';
    issues = [
        {
            text: 'Diagnose an issue',
            title: 'What are the concern(s) with the vehicle?',
            placeholder:
                'p0301 and rough idle, clicking noise when turning left, etc',
            prefix: 'diagnostics for',
        },
        {
            text: 'Perform a procedure',
            title: 'What procedure(s) would you like to perform?',
            placeholder: 'oil change, tire rotation, replace spark plugs, etc',
            prefix: 'procedure for',
        },
        {
            text: 'Look up specifications',
            title: 'What specifications are you looking for?',
            placeholder: 'lug nut torque, oil specs, spark plug gaps, etc',
            prefix: 'specifications for',
        },
        {
            text: 'Look up labor times',
            title: 'What job(s) are you looking up labor times for?',
            placeholder: 'replace spark plugs, coolant change, oil change, etc',
            prefix: 'labor times for',
        },
        {
            text: 'Analyze wiring diagrams',
            title: 'What electrical component(s) are you looking to analyze?',
            placeholder: 'ignition, headlamp, etc',
            prefix: 'wiring diagrams for',
        },
        {
            text: 'Check service intervals',
            title: 'What information are you looking for from the maintenance schedule?',
            placeholder: 'spark plug interval, 90K service, etc',
            prefix: '',
        },
    ];
    chatForm: FormGroup; // Reactive form for chat input

    constructor(
        private motorAiService: MotorAiService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private router: Router
    ) {
        this.route.queryParams.subscribe((params) => {
            this.id = params['id'] || 'N/A';
            this.type = params['type'] || 'N/A';
        });
        this.chatForm = this.fb.group({
            message: [''],
        });
    }
    ngOnInit(): void {
        this.motorAiService.getVehicleInfo(this.type, this.id).subscribe({
            next: (response: Motor<any>) => {
                if (response.status === HttpStatusCode.Ok) {
                    this.vehicleInfo = response.data.vehicleInfo;
                    if (this.type == 0) {
                        this.makeName = this.vehicleInfo.find(
                            (item) => item.Variable === 'Make'
                        )?.Value;
                    }
                    if (this.type == 1) {
                        this.makeName =
                            this.vehicleInfo.Body.Attributes.Engines[0].Manufacturer;
                    }
                } else {
                    console.log(response.message);
                }
            },
            error: (err) => {
                console.error(err);
            },
        });
    }

    openDialog(issue: any) {
        const dialogRef = this.dialog.open(SubmidialogComponent, {
            data: {
                title: issue.title,
                placeholder: issue.placeholder,
            },
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const mess = issue.prefix + ' ' + result;
                this.chatForm.controls['message'].setValue(mess);
                this.sendMessage();
                // console.log('Dialog result:', result);
                // handle the result here
            } else {
                console.log('Dialog was closed without result');
            }
        });
    }

    sendMessage() {
        const mess = this.chatForm.controls['message'].value;
        if (mess) {
            localStorage.setItem('firstMessage', mess);
            this.router.navigate(['apps/motor/product'], {
                queryParams: { id: this.id, type: this.type },
            });
        }
    }
}
