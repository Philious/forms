import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconEnum } from '../../../helpers/enum';
import { AddIconComponent } from './add.icon.component';
import { ArrowLeftIconComponent } from './arrowLeft.icon.component';
import { CheckIconComponent } from './check.icon.component';
import { LetterSizeIconComponent } from './LetterSize.icon.component';
import { ListIconComponent } from './List.icon.component';
import { LogoutIconComponent } from './logout.icon.component';
import { OptionsIconComponent } from './options.icon.component';
import { RemoveIconComponent } from './remove.icon.component';
import { SettingsIconComponent } from './settings.icon.component';
import { ArrowRightIconComponent } from './arrowRight.icon.component';
import { ArrowUpIconComponent } from './arrowUp.icon.component';
import { ArrowDownIconComponent } from './arrowDown.icon.component';
import { DownIconComponent } from './down.icon.component';

@Component({
  selector: 'icon',
  imports: [CommonModule],
  template: `
      <ng-container *ngComponentOutlet="getComponent()" />
  `,
  styles: `
    :host { display: contents; } 
    .icn {
      fill: var(--icn-clr);
      display: block;
      width: 1.5rem;
      height: 1.5rem;
    }
  `,
  encapsulation: ViewEncapsulation.None
})
export class IconComponent {
  @Input() icon!: IconEnum;
  // Map the enum to the corresponding icon components
  private readonly icons: Record<IconEnum, any> = {
    [IconEnum.Add]: AddIconComponent,
    [IconEnum.Down]: DownIconComponent,
    [IconEnum.Cancel]: RemoveIconComponent,
    [IconEnum.Remove]: RemoveIconComponent,
    [IconEnum.ArrowLeft]: ArrowLeftIconComponent,
    [IconEnum.List]: ListIconComponent,
    [IconEnum.Options]: OptionsIconComponent,
    [IconEnum.ArrowRight]: ArrowRightIconComponent,
    [IconEnum.Setting]: SettingsIconComponent,
    [IconEnum.ArrowUp]: ArrowUpIconComponent,
    [IconEnum.Check]: CheckIconComponent,
    [IconEnum.LetterSize]: LetterSizeIconComponent,
    [IconEnum.LogOut]: LogoutIconComponent,
    [IconEnum.ArrowDown]: ArrowDownIconComponent,
  };

  getComponent() {
    return this.icons[this.icon]
  }

}
