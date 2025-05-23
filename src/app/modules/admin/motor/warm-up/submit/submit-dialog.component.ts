import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    standalone: true,
    selector: 'app-submit-dialog',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="max-w-[792px] rounded-[12px] bg-white p-[24px]">
            <form
                [formGroup]="chatForm"
                (ngSubmit)="submit()"
            >
                <h2 class="mb-[24px] text-[24px] font-semibold leading-[32px]">
                    {{ data.title }}
                </h2>
                <input
                    formControlName="message"
                    type="text"
                    placeholder="{{ data.placeholder }}"
                    class="mb-[32px] h-[52px] w-full rounded-[8px] border border-[#D0D5DE] bg-white px-[12px] py-[14px] text-[16px] leading-[24px]"
                />
                <button
                    type="submit"
                    class="h-[48px] w-full rounded-[8px] bg-[#136EFB] px-[30px] py-[12px] text-[16px] text-white"
                >
                    Submit
                </button>
            </form>
        </div>
    `,
})
export class SubmidialogComponent {
    chatForm: FormGroup; // Reactive form for chat input
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SubmidialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { title: string; placeholder: string }
    ) {
        this.chatForm = this.fb.group({
            message: [''],
        });
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        const mess = this.chatForm.controls['message'].value;
        this.dialogRef.close(mess);
    }
}
