import { ScrollArea } from '@/components/ui/scroll-area';
import { Tickets } from '@/definitions';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  pinNumber?: string; // 단건 - 핀번호 사용 목록
  tickets?: Tickets[]; // 다건 - 구매 목록
};

const Wrapper = ({
  gridCols = 3,
  children,
}: {
  gridCols: number;
  children: React.ReactNode;
}) => {
  return (
    <>
      {gridCols < 3 ? (
        <div className="flex justify-center grid grid-cols-2">{children}</div>
      ) : (
        <div className="flex justify-center grid grid-cols-4">{children}</div>
      )}
    </>
  );
};

export default function QrCodeModal({ pinNumber, tickets }: Props) {
  //상품정보 조회해야 함
  return (
    <>
      {Array.isArray(tickets) && tickets.length > 0 ? (
        <ScrollArea>
          <div className="space-y-8 max-h-[400px] min-h-52">
            <Wrapper gridCols={tickets.length}>
              {tickets.map((d) => {
                return (
                  <QRCodeCanvas
                    key={d._id}
                    value={
                      window.location.origin +
                      '/short/o/' +
                      d.shortId +
                      `?shortId=${d.shortId}`
                    }
                    className="m-10"
                  />
                );
              })}
            </Wrapper>
          </div>
        </ScrollArea>
      ) : (
        <>
          {pinNumber && (
            <div className="space-y-8">
              <div className="flex justify-center items-stretch">
                <div className="py-8">
                  <QRCodeCanvas value={pinNumber} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
