import { Component, input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [], 
    templateUrl: './spinnerComponent.html',
    styleUrls: ['./spinnerComponent.css']
})
export class SpinnerComponent {
    
    isLoading = input<boolean>(false);
    mensaje = input<string>('');

}