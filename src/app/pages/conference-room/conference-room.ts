import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-conference-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
  ],
  templateUrl: './conference-room.html',
  styleUrls: ['./conference-room.css'],
})
export class ConferenceRoom implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  // Route & Room state
  private route = inject(ActivatedRoute);
  roomId: string | null = null;

  // Controls state
  isCameraOn = true;
  isMicOn = true;
  connectionQuality: 'good' | 'fair' | 'poor' = 'good';

  // Timer state (e.g., 45 minutes total session)
  totalSecondsLeft = 45 * 60;
  timerInterval: any;
  formattedTime = '45:00';

  // Sidebar state
  isSidebarOpen = true;
  activeTab: 'chat' | 'notes' = 'chat';

  // Chat & Notes state
  messages: { sender: string; text: string; time: string }[] = [
    { sender: 'System', text: 'Connected to Vartahub secure interview room.', time: '10:00 AM' },
  ];
  newMessage = '';
  sessionNotes = '';

  ngOnInit(): void {
    // Grab the roomId from the route parameters
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    console.log('Joined Vartahub Conference Room:', this.roomId);

    this.startTimer();
    this.initMediaStream();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    this.stopMediaStream();
  }

  // --- Media Controls ---
  async initMediaStream() {
    try {
      // Safely check if mediaDevices and getUserMedia are supported by the browser context
      if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (this.localVideo) {
          this.localVideo.nativeElement.srcObject = stream;
        }
      } else {
        console.warn('Media devices API not available. Ensure you are using localhost or HTTPS.');
        this.isCameraOn = false;
        this.isMicOn = false;
      }
    } catch (err) {
      console.error('Error accessing media devices. Check permissions or secure context.', err);
      this.isCameraOn = false;
      this.isMicOn = false;
    }
  }

  stopMediaStream() {
    if (this.localVideo && this.localVideo.nativeElement.srcObject) {
      const stream = this.localVideo.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  toggleCamera() {
    this.isCameraOn = !this.isCameraOn;
    if (this.localVideo && this.localVideo.nativeElement.srcObject) {
      const stream = this.localVideo.nativeElement.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = this.isCameraOn));
    }
  }

  toggleMic() {
    this.isMicOn = !this.isMicOn;
    if (this.localVideo && this.localVideo.nativeElement.srcObject) {
      const stream = this.localVideo.nativeElement.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = this.isMicOn));
    }
  }

  // --- Timer Logic ---
  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.totalSecondsLeft > 0) {
        this.totalSecondsLeft--;
        const minutes = Math.floor(this.totalSecondsLeft / 60);
        const seconds = this.totalSecondsLeft % 60;
        this.formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  // --- Chat Logic ---
  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.messages.push({
      sender: 'You',
      text: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    this.newMessage = '';
  }

  // --- Help Modal Trigger ---
  openHelpModal() {
    alert(
      'Interview Help & Prompt Bank:\n\n1. Ask about previous system design scaling challenges.\n2. Coding challenge: Two Pointer approach for sorted arrays.\n3. Evaluate communication clarity and edge-case handling.',
    );
  }

  leaveCall() {
    if (confirm('Are you sure you want to end or leave the interview?')) {
      // Navigate back to dashboard or schedule view
    }
  }
  // Screen share:

  isScreenSharing = false;
  private screenStream: MediaStream | null = null;
  private originalVideoTrack: MediaStreamTrack | null = null;

  async toggleScreenShare() {
    try {
      if (!this.isScreenSharing) {
        // FIX: Use getDisplayMedia to trigger the browser's screen/tab/window selection dialog
        this.screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: true,
          audio: true,
        });

        const screenTrack = this.screenStream!.getVideoTracks()[0];

        // Save original camera track so we can switch back later
        if (this.localVideo && this.localVideo.nativeElement.srcObject) {
          const currentStream = this.localVideo.nativeElement.srcObject as MediaStream;
          const videoTracks = currentStream.getVideoTracks();
          if (videoTracks.length > 0) {
            this.originalVideoTrack = videoTracks[0];
            currentStream.removeTrack(this.originalVideoTrack);
          }
          // Add screen share track to the local video element stream
          currentStream.addTrack(screenTrack);
        }

        // Handle user clicking the native browser "Stop Sharing" button on the floating toolbar
        screenTrack.onended = () => {
          this.stopScreenShare();
        };

        this.isScreenSharing = true;
      } else {
        this.stopScreenShare();
      }
    } catch (err) {
      console.error('Error sharing screen (user may have canceled prompt):', err);
      this.isScreenSharing = false;
    }
  }

  stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;
    }

    // Restore original camera track if available
    if (this.localVideo && this.localVideo.nativeElement.srcObject && this.originalVideoTrack) {
      const currentStream = this.localVideo.nativeElement.srcObject as MediaStream;
      const currentVideoTracks = currentStream.getVideoTracks();
      if (currentVideoTracks.length > 0) {
        currentStream.removeTrack(currentVideoTracks[0]);
      }
      currentStream.addTrack(this.originalVideoTrack);
      this.originalVideoTrack = null;
    }

    this.isScreenSharing = false;
  }
}
