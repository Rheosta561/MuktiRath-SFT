import { useSocket } from "@/hooks/useSocket";

type Props = {
  userToken: string | null;
};

export const SocketHandler = ({ userToken }: Props) => {
// custom hook
  useSocket(userToken);


  return null;
};
