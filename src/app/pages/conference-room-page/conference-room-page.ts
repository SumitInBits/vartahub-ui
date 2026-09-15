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
  selector: 'app-conference-room-page',
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
  templateUrl: './conference-room-page.html',
  styleUrls: ['./conference-room-page.css'],
})
export class ConferenceRoomPage implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('roomContainer') roomContainer!: ElementRef<HTMLDivElement>;

  // Route & Room state
  private route = inject(ActivatedRoute);
  roomId: string | null = null;

  // Controls state
  isCameraOn = true;
  isMicOn = true;
  isPeerMuted = false;
  isScreenSharing = false;
  isFullScreen = false;
  connectionQuality: 'excellent' | 'good' | 'poor' = 'excellent';

  // Timer state (45 minutes session)
  totalSecondsLeft = 45 * 60;
  timerInterval: any;
  formattedTime = '45:00';

  // Sidebar & Layout state
  isSidebarOpen = true;
  activeTab: 'chat' | 'notes' | 'participants' = 'chat';

  // Chat, Notes & Participants state
  messages: { sender: string; text: string; time: string; isSystem?: boolean }[] = [
    {
      sender: 'System',
      text: 'Secure end-to-end encrypted session established via Vartahub.',
      time: '10:00 AM',
      isSystem: true,
    },
  ];
  newMessage = '';
  sessionNotes = '';
  participants = [
    {
      name: 'You (Host)',
      role: 'Senior Interviewer',
      avatar: 'YH',
      isMuted: false,
      isCameraOn: true,
    },
    {
      name: 'Amit Kumar',
      role: 'Candidate / Peer',
      avatar: 'AK',
      isMuted: false,
      isCameraOn: true,
    },
  ];

  private screenStream: MediaStream | null = null;
  private originalVideoTrack: MediaStreamTrack | null = null;

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || 'VRTA-8842';
    this.startTimer();
    this.initMediaStream();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    this.stopMediaStream();
  }

  // --- Media Stream Management ---
  async initMediaStream() {
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (this.localVideo) {
          this.localVideo.nativeElement.srcObject = stream;
        }
      } else {
        this.fallbackMediaState();
      }
    } catch (err) {
      console.error('Media permission denied or unavailable:', err);
      this.fallbackMediaState();
    }
  }

  private fallbackMediaState() {
    this.isCameraOn = false;
    this.isMicOn = false;
  }

  stopMediaStream() {
    if (this.localVideo?.nativeElement?.srcObject) {
      const stream = this.localVideo.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
    }
  }

  toggleCamera() {
    this.isCameraOn = !this.isCameraOn;
    if (this.localVideo?.nativeElement?.srcObject) {
      const stream = this.localVideo.nativeElement.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = this.isCameraOn));
    }
  }

  toggleMic() {
    this.isMicOn = !this.isMicOn;
    if (this.localVideo?.nativeElement?.srcObject) {
      const stream = this.localVideo.nativeElement.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = this.isMicOn));
    }
  }

  // --- Screen Sharing ---
  async toggleScreenShare() {
    try {
      if (!this.isScreenSharing) {
        this.screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: true,
          audio: true,
        });

        const screenTrack = this.screenStream!.getVideoTracks()[0];

        if (this.localVideo?.nativeElement?.srcObject) {
          const currentStream = this.localVideo.nativeElement.srcObject as MediaStream;
          const videoTracks = currentStream.getVideoTracks();
          if (videoTracks.length > 0) {
            this.originalVideoTrack = videoTracks[0];
            currentStream.removeTrack(this.originalVideoTrack);
          }
          currentStream.addTrack(screenTrack);
        }

        screenTrack.onended = () => {
          this.stopScreenShare();
        };

        this.isScreenSharing = true;
      } else {
        this.stopScreenShare();
      }
    } catch (err) {
      console.error('Screen sharing canceled or failed:', err);
      this.isScreenSharing = false;
    }
  }

  stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;
    }

    if (this.localVideo?.nativeElement?.srcObject && this.originalVideoTrack) {
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

  // --- Fullscreen Toggle ---
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.isFullScreen = false;
      }
    }
  }

  // --- Timer ---
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

  // --- Chat Messaging ---
  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.messages.push({
      sender: 'You',
      text: this.newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    this.newMessage = '';
  }

  // --- Interview Help Prompt Bank ---
  openHelpModal() {
    alert(
      'Vartahub Professional Interview Guide:\n\n1. Technical Focus: Evaluate algorithms using optimal Time/Space complexity.\n2. System Architecture: Review scalability bottlenecks and database indexing strategies.\n3. Communication: Encourage structured thought-sharing before writing implementation details.',
    );
  }

  leaveCall() {
    if (
      confirm(
        'Are you sure you want to exit the conference room? Your session evaluations will be saved.',
      )
    ) {
      // Handle navigation back to dashboard
    }
  }
}
