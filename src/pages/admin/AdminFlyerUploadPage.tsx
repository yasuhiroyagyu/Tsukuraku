import { Card } from "../../components/common/Card";
import { FlyerUploadForm } from "../../components/admin/FlyerUploadForm";
import { PageContainer } from "../../components/layout/PageContainer";
export function AdminFlyerUploadPage() { return <PageContainer className="max-w-4xl"><p className="eyebrow">NEW FLYER</p><h1 className="mt-2 text-3xl font-black">チラシをアップロード</h1><p className="mt-2 text-sm text-slate-600">掲載店舗と期間を指定し、商品データを解析・登録します。</p><Card className="mt-7 p-5 sm:p-7"><FlyerUploadForm /></Card></PageContainer>; }
