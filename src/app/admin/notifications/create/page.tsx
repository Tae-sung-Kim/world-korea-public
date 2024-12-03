import NotificationsForm from '../notifications-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsCreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">팝업 알림 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsForm />
        </CardContent>
      </Card>
    </div>
  );
}
