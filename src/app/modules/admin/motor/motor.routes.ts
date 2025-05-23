import { Routes } from '@angular/router';
import { MotorComponent } from './motor.component';
import { ProductComponent } from './product/product.component';
import { WarmUpComponent } from './warm-up/warm-up.component';

export default [
    {
        path: '',
        component: MotorComponent,
    },
    {
        path: 'product', // Show only the chat UI at /apps/motor/product
        component: ProductComponent,
    },
    {
        path: 'warm-up', // Show only the chat UI at /apps/motor/product
        component: WarmUpComponent,
    },
] as Routes;
