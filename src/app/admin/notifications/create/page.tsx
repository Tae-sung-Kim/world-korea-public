import NotificationsForm from '../notifications-form';
import { Card, CardContent } from '@/components/ui/card';

export default function NotificationsCreatePage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent>
        <NotificationsForm />
      </CardContent>
    </Card>
  );
}
