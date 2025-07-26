import {CartForm} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type OrderNoteSectionProps = {
  cart: CartApiQueryFragment | null;
};

export function OrderNoteSection({cart}: OrderNoteSectionProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(cart?.note ?? '');

  useEffect(() => {
    setNote(cart?.note ?? '');
  }, [cart?.note]);

  // Handle submit manually
  const handleSave = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 text-sm">
        {/* <button
          className="underline font-medium"
          onClick={() => setOpen(true)}
        >
          {note ? 'Edit Note' : 'Add Order Note'}
        </button> */}
        <span className="text-gray-700 text-left">
          Shipping & taxes calculated at checkout
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-t-2xl p-5"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* <h3 className="text-base font-semibold mb-4 uppercase">
                Add Order Note
              </h3> */}

              <CartForm action={CartForm.ACTIONS.NoteUpdate}>
  <textarea
    name="note"
    placeholder="How can we help you?"
    className="w-full border border-gray-400 p-3 rounded mb-4 text-sm"
    value={note}
    onChange={(e) => setNote(e.target.value)}
    rows={4}
  />
  <button
    type="submit"
    className="w-full py-3 bg-[#f05d78] text-white font-semibold rounded text-sm"
    onClick={() => setOpen(false)}  // ✅ close popup on click
  >
    SAVE
  </button>
</CartForm>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
