import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(controlName: string): ValidatorFn {
	return (formGroup: AbstractControl) => {
		const control = formGroup.get(controlName);
		if (!control) { return null; }

		const value = control.value;
		const isValid = /^[a-z][a-z0-9]{2,35}$/.test(value);

		if (!isValid && value) {
			const existingErrors = control.errors || {};
			existingErrors['isUserNameInValid'] = true;
			control.setErrors(existingErrors);
		} else {
			if (control.errors?.['isUserNameInValid']) {
				const { isUserNameInValid, ...otherErrors } = control.errors;
				control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
			}
		}
		return null;
	};
}

export function emailValidator(controlName: string): ValidatorFn {
	return (formGroup: AbstractControl) => {
		const control = formGroup.get(controlName);
		if (!control) { return null; }

		const value = control.value;
		const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

		if (!isValid && value) {
			const existingErrors = control.errors || {};
			existingErrors['isEmailInValid'] = true;
			control.setErrors(existingErrors);
		} else {
			if (control.errors?.['isEmailInValid']) {
				const { isEmailInValid, ...otherErrors } = control.errors;
				control.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
			}
		}

		return null;
	};
}

export function passwordsAreNotSameValidator(
	passwordKey: string,
	confirmPasswordKey: string
): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		if (!(formGroup instanceof FormGroup)) {
			return null;
		}

		const passwordControl = formGroup.get(passwordKey);
		const confirmPasswordControl = formGroup.get(confirmPasswordKey);

		if (!passwordControl || !confirmPasswordControl) {
			return null;
		}

		if (!confirmPasswordControl.value) {
			// Mark confirmPassword as required if it's empty
			confirmPasswordControl.setErrors({ required: true });
			return { required: true };
		}

		if (passwordControl.value !== confirmPasswordControl.value) {
			confirmPasswordControl.setErrors({ passwordsAreNotSame: true });
			return { passwordsAreNotSame: true };
		}

		confirmPasswordControl.setErrors(null);
		return null;
	};
}

export function passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
	const value = control.value;
	if (!value) {
		return null;
	}
	// Regex requiring:
	// - At least one lowercase letter
	// - At least one uppercase letter
	// - At least one digit
	// - Minimum length of 8 characters
	// - At least one special character from the set [!@#$%^&*()_+{}[]:;<>,.?~\-]
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;

	// If user typed something and the control is dirty
	if (value && control.dirty) {
		if (!passwordRegex.test(value)) {
			return { invalidPassword: true };
		}
	}
	return null;
}
