import { inject, Injectable } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';


@Injectable()
export class MatOverlayAutoDismiss extends Overlay {
  public popoverListForDismiss: Array<OverlayRef> = [];

  override create(config?: OverlayConfig): OverlayRef {
		const overlayRef = super.create(config);
		this.popoverListForDismiss.push(overlayRef);
		return overlayRef;
	}
}
