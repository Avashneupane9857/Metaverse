
export type ClientMessage =
  | { type: "join"; payload: { spaceId: string; token: string } }
  | { type: "move"; payload: { x: number; y: number } };

  export type ServerMessage =
  | {
      type: "space-joined";
      payload: {
        spawn: { x: number; y: number };
        users: { id: string }[]; 
      };
    }
  | { type: "movement-rejected"; payload: { x: number; y: number } }
  | {
      type: "movement";
      payload: { x: number; y: number; userId: string }; 
    }
  | { type: "user-left"; payload: { userId: string } } 
  | { type: "user-join"; payload: { userId: string; x: number; y: number } }; 
