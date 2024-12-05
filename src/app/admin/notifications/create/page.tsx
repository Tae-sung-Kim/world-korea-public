import NotificationsForm from '../notifications-form';
import { Card, CardContent } from '@/components/ui/card';

export default function NotificationsCreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <NotificationsForm />
        </CardContent>
      </Card>
    </div>
  );
}
