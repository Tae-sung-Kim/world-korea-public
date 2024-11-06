import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NoSessionPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Alert className="max-w-md bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg">
        <AlertTitle className="font-bold text-lg">
          잘못된 경로입니다.
        </AlertTitle>
        <AlertDescription className="mt-2 text-sm">
          판매처에 QR코드를 보여주세요.
        </AlertDescription>
      </Alert>
    </div>
  );
}
