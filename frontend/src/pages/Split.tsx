import { Sidebar } from "@/components/Sidebar"
import { AddGroupModal } from "@/components/Split/AddGroupModal"

const Split = () => {
  return (
    <div className="flex">
        <Sidebar />

        <div className="flex flex-col items-center max-w-4xl mx-auto my-auto">
            <AddGroupModal />
        </div>
    </div>
  )
}

export default Split