
// Type definitions
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate?: string;
  height?: string;
  weight?: string;
  fitnessLevel?: string;
  goals?: string;
  medicalHistory?: string;
  status: string;
  age?: number;
  sex?: string;
  diets: Diet[];
  workouts: Workout[];
}

interface Diet {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
  createdAt: string;
  // Other diet properties
}

interface Workout {
  id: number;
  name: string;
  clientId: number;
  clientName: string;
  createdAt: string;
  // Other workout properties
}

// Storage keys
const CLIENTS_STORAGE_KEY = 'fit-manager-clients';
const DIETS_STORAGE_KEY = 'fit-manager-diets';
const WORKOUTS_STORAGE_KEY = 'fit-manager-workouts';

// Client functions
export const getClients = (): Client[] => {
  const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return storedClients ? JSON.parse(storedClients) : [];
};

export const saveClient = (client: Client) => {
  const clients = getClients();
  const updatedClients = [...clients, client];
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
  return client;
};

export const updateClient = (updatedClient: Client) => {
  const clients = getClients();
  const updatedClients = clients.map(client => 
    client.id === updatedClient.id ? updatedClient : client
  );
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
  return updatedClient;
};

export const deleteClient = (clientId: number) => {
  const clients = getClients();
  const updatedClients = clients.filter(client => client.id !== clientId);
  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
};

export const getClientById = (clientId: number): Client | undefined => {
  const clients = getClients();
  return clients.find(client => client.id === clientId);
};

// Diet functions
export const getDiets = (): Diet[] => {
  const storedDiets = localStorage.getItem(DIETS_STORAGE_KEY);
  return storedDiets ? JSON.parse(storedDiets) : [];
};

export const saveDiet = (diet: Diet) => {
  // Save diet to storage
  const diets = getDiets();
  const updatedDiets = [...diets, diet];
  localStorage.setItem(DIETS_STORAGE_KEY, JSON.stringify(updatedDiets));
  
  // Update client with diet reference
  const client = getClientById(diet.clientId);
  if (client) {
    client.diets = [...client.diets, diet];
    updateClient(client);
  }
  
  return diet;
};

// Workout functions
export const getWorkouts = (): Workout[] => {
  const storedWorkouts = localStorage.getItem(WORKOUTS_STORAGE_KEY);
  return storedWorkouts ? JSON.parse(storedWorkouts) : [];
};

export const saveWorkout = (workout: Workout) => {
  // Save workout to storage
  const workouts = getWorkouts();
  const updatedWorkouts = [...workouts, workout];
  localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(updatedWorkouts));
  
  // Update client with workout reference
  const client = getClientById(workout.clientId);
  if (client) {
    client.workouts = [...client.workouts, workout];
    updateClient(client);
  }
  
  return workout;
};

// Stats functions
export const getStats = () => {
  const clients = getClients();
  const diets = getDiets();
  const workouts = getWorkouts();
  
  return {
    totalClients: clients.length,
    activeWorkouts: workouts.length,
    activeDiets: diets.length,
    completedSessions: 0 // This would be implemented with actual session tracking
  };
};
