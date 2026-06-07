// components/fares/FareFormModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  FarePayload,
  ShareVehicleFare,
} from "@/hooks/shareVehicleFare/useShareVehicleFare";

import { useEffect, useState } from "react";

interface FareFormModalProps {
  open: boolean;
  editingFare?: ShareVehicleFare | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: FarePayload) => void;
}

const emptyForm: FarePayload = {
  fromLocation: "",
  toLocation: "",
  perSeatFare: 0,
};

export default function FareFormModal({
  open,
  editingFare,
  isSubmitting = false,
  onClose,
  onSubmit,
}: FareFormModalProps) {
  const [form, setForm] = useState<FarePayload>(emptyForm);

  // Populate form when editing
  useEffect(() => {
    if (editingFare) {
      setForm({
        fromLocation: editingFare.fromLocation,
        toLocation: editingFare.toLocation,
        perSeatFare: editingFare.perSeatFare,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingFare, open]);

  const handleSubmit = () => {
    if (!form.fromLocation || !form.toLocation || !form.perSeatFare) return;
    onSubmit(form);
  };

  const isEdit = !!editingFare;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Fare Configuration" : "Add Fare Configuration"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="fromLocation">From Location</Label>
            <Input
              id="fromLocation"
              placeholder="e.g. Rajshahi"
              value={form.fromLocation}
              onChange={(e) =>
                setForm({ ...form, fromLocation: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="toLocation">To Location</Label>
            <Input
              id="toLocation"
              placeholder="e.g. Dhaka"
              value={form.toLocation}
              onChange={(e) => setForm({ ...form, toLocation: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="perSeatFare">Per Seat Fare (৳)</Label>
            <Input
              id="perSeatFare"
              type="number"
              placeholder="e.g. 250"
              value={form.perSeatFare || ""}
              onChange={(e) =>
                setForm({ ...form, perSeatFare: Number(e.target.value) })
              }
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !form.fromLocation ||
              !form.toLocation ||
              !form.perSeatFare
            }
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update"
                : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
