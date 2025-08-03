import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccessMap } from '../../services/user.service';

@Component({
  selector: 'app-access-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './access-dialog.component.html',
  styleUrls: ['./access-dialog.component.css']
})
export class AccessDialogComponent{
  @Input() isOpen = false;
  @Input() accessMap: AccessMap = {
    sermons: { read: false, write: false, delete: false },
    announcements: { read: false, write: false, delete: false },
    events: { read: false, write: false, delete: false }
  };
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AccessMap>();

  modules = ['sermons', 'announcements', 'events'];

  // localAccessMap: AccessMap = {
  //   sermons: { read: false, write: false, delete: false },
  //   announcements: { read: false, write: false, delete: false },
  //   events: { read: false, write: false, delete: false }
  // };

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['accessMap'] && this.accessMap) {
  //     // Deep clone to prevent mutating the input
  //     this.localAccessMap = JSON.parse(JSON.stringify(this.accessMap));
  //   }
  // }

  closeDialog() {
    this.close.emit();
  }

  updatePermission(module: keyof AccessMap, permission: 'read' | 'write' | 'delete', event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.accessMap[module][permission] = checked;
  }

  saveChanges() {
    this.save.emit(this.accessMap);
  }
}
