import { TimezoneInterface } from 'timezone-picker';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CountryInterface } from "../interfaces/country.interface";

// Helper type to check if T is a simple type (string, number, boolean, etc.)
type IsSimpleObject<T> = T extends string | number | boolean | null | undefined ? true : false;

export type FormControlsMap<T> = {
	[P in keyof T]: T[P] extends Array<any> ? FormArray :
		T[P] extends CountryInterface ? FormControl<T[P]> :
			T[P] extends TimezoneInterface ? FormControl<T[P]> :
				IsSimpleObject<T[P]> extends true ? FormControl<T[P]> :
					T[P] extends Record<string, any> ? FormGroup<FormControlsMap<T[P]>> : FormControl<T[P]>;
};
