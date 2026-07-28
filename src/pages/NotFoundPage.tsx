import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { PageContainer } from "../components/layout/PageContainer";
export function NotFoundPage() { const navigate = useNavigate(); return <PageContainer><EmptyState title="ページが見つかりません" description="URLを確認するか、ホームからやり直してください。" action={<Button onClick={() => navigate("/")}>ホームへ戻る</Button>} /></PageContainer>; }
