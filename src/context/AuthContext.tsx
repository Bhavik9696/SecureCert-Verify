import React, { createContext, useContext, useState, useEffect } from 'react';
import { LecturerUser, FacultyTeam, TeamMember } from '../types/index.js';
import { apiService } from '../services/api.js';

export const FACULTY_TEAMS: FacultyTeam[] = [
  'Computer Science & Engineering',
  'Artificial Intelligence & ML',
  'Information Science & Eng',
  'Cyber Security & Forensics',
  'Data Science & Analytics',
];

export const DEMO_TEAM_MEMBERS: Record<FacultyTeam, TeamMember[]> = {
  'Computer Science & Engineering': [
    { id: 'm1', name: 'Dr. Rajesh Sharma', role: 'Department Head', email: 'rsharma@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 'm2', name: 'Prof. Anita Rao', role: 'Senior Lecturer', email: 'anita.rao@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: 'm3', name: 'Dr. Vikram Patel', role: 'Audit Coordinator', email: 'vpatel@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  ],
  'Artificial Intelligence & ML': [
    { id: 'm4', name: 'Dr. Meera Nambiar', role: 'Department Head', email: 'meera.n@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: 'm5', name: 'Prof. Suresh Kumar', role: 'Assistant Professor', email: 'suresh.k@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  ],
  'Information Science & Eng': [
    { id: 'm6', name: 'Dr. Sunita Deshmukh', role: 'Department Head', email: 'sunita.d@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 'm7', name: 'Prof. Arjun Varma', role: 'Audit Coordinator', email: 'arjun.v@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  ],
  'Cyber Security & Forensics': [
    { id: 'm8', name: 'Dr. Kabir Fernandez', role: 'Department Head', email: 'kabir.f@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  ],
  'Data Science & Analytics': [
    { id: 'm9', name: 'Dr. Priya Sundaram', role: 'Department Head', email: 'priya.s@university.edu', avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150' },
  ],
};

interface AuthContextType {
  user: LecturerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeTeam: FacultyTeam;
  availableTeams: FacultyTeam[];
  teamMembers: TeamMember[];
  setActiveTeam: (team: FacultyTeam) => void;
  toggleTeam: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LecturerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTeam, setActiveTeamState] = useState<FacultyTeam>('Computer Science & Engineering');

  useEffect(() => {
    const savedToken = localStorage.getItem('securecert_token');
    const savedUser = localStorage.getItem('securecert_user');
    const savedTeam = localStorage.getItem('securecert_team') as FacultyTeam | null;

    if (savedTeam && FACULTY_TEAMS.includes(savedTeam)) {
      setActiveTeamState(savedTeam);
    }

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('securecert_token');
        localStorage.removeItem('securecert_user');
      }
    } else {
      const demoUser: LecturerUser = {
        id: 'lec-101',
        name: 'Dr. Rajesh Sharma',
        email: 'lecturer@university.edu',
        department: 'Computer Science & Engineering',
        institution: 'St. Joseph Engineering College',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
      setUser(demoUser);
      setToken('demo_token');
    }
    setIsLoading(false);
  }, []);

  const setActiveTeam = (team: FacultyTeam) => {
    setActiveTeamState(team);
    localStorage.setItem('securecert_team', team);
    if (user) {
      const updatedUser = { ...user, department: team };
      setUser(updatedUser);
      localStorage.setItem('securecert_user', JSON.stringify(updatedUser));
    }
  };

  const toggleTeam = () => {
    const currentIndex = FACULTY_TEAMS.indexOf(activeTeam);
    const nextIndex = (currentIndex + 1) % FACULTY_TEAMS.length;
    setActiveTeam(FACULTY_TEAMS[nextIndex]);
  };

  const login = async (email: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      const data = await apiService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      if (data.user?.department && FACULTY_TEAMS.includes(data.user.department as FacultyTeam)) {
        setActiveTeamState(data.user.department as FacultyTeam);
      }
      if (rememberMe) {
        localStorage.setItem('securecert_token', data.token);
        localStorage.setItem('securecert_user', JSON.stringify(data.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('securecert_token');
    localStorage.removeItem('securecert_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        activeTeam,
        availableTeams: FACULTY_TEAMS,
        teamMembers: DEMO_TEAM_MEMBERS[activeTeam] || [],
        setActiveTeam,
        toggleTeam,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
