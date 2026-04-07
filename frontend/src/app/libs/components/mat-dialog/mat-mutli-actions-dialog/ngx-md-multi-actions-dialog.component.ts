import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';

import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatToolbarRow } from '@angular/material/toolbar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { EmptyTemplateComponent } from '../../empty-templates/empty-template/empty-template.component';
import { EmptyErrorTemplateInterface } from '../../empty-templates/interface/empty-error-template.interface';
import { MatMultiActionsInterface } from './mat-multi-actions.interface';
import { TemplateMode } from '../../empty-templates/enums/template-mode';

@Component({
	templateUrl: './ngx-md-multi-actions-dialog.component.html',
	imports: [
		EmptyTemplateComponent,
		NgForOf,
		NgIf,
		MatButton,
		MatToolbarRow,
		FaIconComponent
	],
	styleUrls: ['./ngx-md-multi-actions-dialog.component.scss'],
	standalone: true
})
export class NgxMdMultiActionsDialogComponent implements OnInit {
	public errorTemplateDetails: EmptyErrorTemplateInterface;

		constructor(public dialogRef: MatDialogRef<NgxMdMultiActionsDialogComponent>,
	            public translateService: TranslateService,
	            @Inject(MAT_DIALOG_DATA) public data: MatMultiActionsInterface) {
	}

	public dismissModal() {
		this.dialogRef.close();
	}

	async ngOnInit() {
		_.each(this.data.action, action => {
			const originalHandler = action.handler;
			action.handler = () => {
				this.dismissModal();
				originalHandler();
			};
		});
		this.errorTemplateDetails = {
			faIcon: ['fal', 'triangle-exclamation'],
			mode: TemplateMode.errorTemplate,
			title: await firstValueFrom(this.translateService.get('events.eventsDetails.filesErrors.errorTemplate.title')),
			description: this.translateService.instant('events.eventsDetails.filesErrors.errorTemplate.description')
		};
	}
}
